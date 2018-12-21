$(function () {
  var standings=[];
  //https://api.football-data.org/v2/competitions/PL/teams?season=2017
  //replace 
        $.ajax({
            url: 'JSON/team.json',
            type: 'GET',
            headers:{
                "X-Auth-Token":"c488e37ed9de4619aeeafb07caf1be3f"
            },
            beforeSend: function (f) {
              
            },
            success: function (data) {
               if(data.teams.length>0)
               {
                $('#drpLikedteam').append('<option value="0"></option>');
                $('#drpDislikedteam').append('<option value="0"></option>');
                $.each(data.teams,function(index,item){
                    $('#drpLikedteam').append('<option value="'+item.id+'">'+item.name+'</option>');
                    $('#drpDislikedteam').append('<option value="'+item.id+'">'+item.name+'</option>');
                });
                }
            },
            error: function (e) {
                alert(e);
            },
            complete: function () {
               

            }
        });        
        
       loadStanding($("input:radio[name=rdofilter]").val());
        $('#drpLikedteam, #drpDislikedteam').change(function(){
              //  alert('cahnged '+$(this).val()+' text'+ $(this).find("option:selected").text());           
         dropdownchange();
               
        }); 
        
        $('#btnApply').click(function(){
            if( !$(this).hasClass('clicked'))
            {
            var $likedRow=$('#standingData .liked');
            var $dislikedRow=$('#standingData .disliked');
            var $tempRow=$('<tr><td></td></tr>');
            var likedPoint=parseInt($likedRow.attr('data-point'));
            var dislikedPoint= parseInt($dislikedRow.attr('data-point'));
            if(dislikedPoint > likedPoint)
            {
           
            $dislikedRow.after($tempRow);
            $likedRow.after($dislikedRow);
            $tempRow.replaceWith($likedRow);

            $(this).addClass('clicked');
            }
            }
        });
        $('#btnReset').click(function(){            
            loadStanding('TOTAL');
            $('#drpLikedteam').val('0');
            $('#drpDislikedteam').val('0');
            $('#btnApply').prop('disabled',true);
            if($('#btnApply').hasClass('clicked'))
            {
                $('#btnApply').removeClass('clicked');
            }
        });

        $("input:radio[name=rdofilter]").click(function(){           
            loadStanding($(this).val());
        })


    });

    function loadStanding(value)
    {
        if(value=='TOTAL' || value=='HOME' || value=='AWAY')
        {
            // 'https://api.football-data.org/v2/competitions/PL/standings?season=2017&standingType='+value
        $.ajax({
            url: 'JSON/'+value+'.json',
            type: 'GET',
            headers:{
                "X-Auth-Token":"c488e37ed9de4619aeeafb07caf1be3f"
            },
            beforeSend: function (f) {              
             
            },
            success: function (data) {
               if(data.standings[0].table.length>0)
               {
                $('#standingData tbody').empty();
              // standings=data.standings[0].table;
                $.each(data.standings[0].table,function(index,item){
                 var tablehtml='';
                  tablehtml+='<tr data-id="'+item.team.id+'" data-point="'+item.points+'"><td><img src="'+item.team.crestUrl+'" width="50px" height="50px"></td><td>'+item.position+'</td>';
                  tablehtml+='<td>'+item.team.name+'</td><td>'+item.playedGames+'</td><td>'+item.won+'</td>';
                  tablehtml+='<td>'+item.draw+'</td><td>'+item.lost+'</td><td>'+item.points+'</td></tr>';
                  $('#standingData tbody').append(tablehtml);
                });

                }
            },
            error: function (e) {
                alert(e);
            },
            complete: function () {
                //$('#btnAdditionalTestVerify').removeClass("ui-loading");
                //$('#btnAdditionalTestVerify').prop('disabled', false);
               

            }
        }); 
    }
    }

    function dropdownchange()
    {       

        if($('#drpLikedteam').val()=='0' || $('#drpDislikedteam').val()=='0')
        {
            $('#btnApply').prop('disabled',true);
            $('.message').html('');
        }
        else
        {
            if($('#drpLikedteam').val()==$('#drpDislikedteam').val())
            {
               $('.message').html('you cannot select same liked & disliked team!');
               $('#btnApply').prop('disabled',true);
            }
            else
            {
                $('.message').html('');
                $('#btnApply').prop('disabled',false);
                applyLikedAndDisliked();
            }     
           
        }        
        
    }
    function applyLikedAndDisliked()
    {
        var tableRows= $('#standingData tbody tr');
        if(tableRows.length>0)
        {
            tableRows.each(function(index)
        {
            if( $(this).attr('data-id') == $('#drpLikedteam').val())
            {
                $(this).addClass('liked');

            }
            else if( $(this).attr('data-id') == $('#drpDislikedteam').val())
            {
                $(this).addClass('disliked');
            }
            else
            {
                if($(this).hasClass('liked'))
                {
                $(this).removeClass('liked');
                }
                if( $(this).hasClass('disliked'))
                {
                $(this).removeClass('disliked');
                }
            }
        });
        }
    }